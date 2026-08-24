#!/usr/bin/env python3
"""
LifeLink ChromaDB Query Sidecar
================================
Serves the Harrison's Manual 20e medical knowledge base over HTTP.
Run: uvicorn chroma_server:app --port 8001 --reload
"""

import os
import sys
from contextlib import asynccontextmanager
from typing import Any

import chromadb
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# ─── Config ───────────────────────────────────────────────────────────────────
# Path to the ChromaDB persistent store (relative to this file's directory)
DB_PATH = os.path.join(os.path.dirname(__file__))
COLLECTION_NAME = os.environ.get("CHROMA_COLLECTION", "harrisons_manual_20e")
DEFAULT_N_RESULTS = 5

# ─── Global state ─────────────────────────────────────────────────────────────
_collection: Any = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ChromaDB collection on startup."""
    global _collection
    print(f"[ChromaDB] Loading collection '{COLLECTION_NAME}' from '{DB_PATH}'...")
    try:
        client = chromadb.PersistentClient(path=DB_PATH)
        _collection = client.get_collection(COLLECTION_NAME)
        print(f"[ChromaDB] ✓ Collection loaded — {_collection.count()} chunks ready")
    except Exception as e:
        print(f"[ChromaDB] ✗ Failed to load collection: {e}", file=sys.stderr)
        raise RuntimeError(f"ChromaDB startup failed: {e}") from e
    yield
    print("[ChromaDB] Shutting down.")


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LifeLink ChromaDB Sidecar",
    description="Serves Harrison's Manual medical knowledge base queries for Gemini RAG",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ─── Models ───────────────────────────────────────────────────────────────────
class QueryRequest(BaseModel):
    query: str
    n_results: int = DEFAULT_N_RESULTS


class ChunkResult(BaseModel):
    id: str
    document: str
    metadata: dict
    distance: float
    source: str  # human-readable source label


class QueryResponse(BaseModel):
    query: str
    results: list[ChunkResult]
    collection: str
    total_chunks: int


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    if _collection is None:
        raise HTTPException(status_code=503, detail="Collection not loaded")
    return {
        "status": "ok",
        "collection": COLLECTION_NAME,
        "chunks": _collection.count(),
    }


@app.post("/query", response_model=QueryResponse)
def query_collection(req: QueryRequest):
    if _collection is None:
        raise HTTPException(status_code=503, detail="Collection not loaded")
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    n = max(1, min(req.n_results, 10))  # clamp between 1 and 10

    try:
        results = _collection.query(
            query_texts=[req.query],
            n_results=n,
            include=["documents", "metadatas", "distances"],
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ChromaDB query error: {e}") from e

    ids = results["ids"][0]
    docs = results["documents"][0]
    metas = results["metadatas"][0]
    dists = results["distances"][0]

    chunks: list[ChunkResult] = []
    for cid, doc, meta, dist in zip(ids, docs, metas, dists):
        # Build a human-readable source label from metadata fields.
        # Harrison's Manual chunks typically have chapter/page/section metadata.
        chapter = meta.get("chapter") or meta.get("section") or meta.get("source") or ""
        page = meta.get("page") or meta.get("page_number") or ""
        if chapter and page:
            source_label = f"Harrison's Manual 20e — {chapter}, p.{page}"
        elif chapter:
            source_label = f"Harrison's Manual 20e — {chapter}"
        elif page:
            source_label = f"Harrison's Manual 20e, p.{page}"
        else:
            source_label = "Harrison's Manual of Medicine, 20th Edition"

        chunks.append(
            ChunkResult(
                id=cid,
                document=doc,
                metadata=meta,
                distance=round(float(dist), 4),
                source=source_label,
            )
        )

    return QueryResponse(
        query=req.query,
        results=chunks,
        collection=COLLECTION_NAME,
        total_chunks=_collection.count(),
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("chroma_server:app", host="0.0.0.0", port=8001, reload=False)
