import sys
import json
import os
import sqlite3
import re

MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
SQLITE_PATH = os.path.join(MODEL_DIR, "chroma.sqlite3")

def format_source(meta):
    meta = meta or {}
    chapter = meta.get("chapter_name") or meta.get("chapter") or meta.get("section_name") or meta.get("section") or ""
    ch_num = meta.get("chapter_number")
    page = meta.get("printed_page") or meta.get("pdf_page") or meta.get("page") or ""
    edition = meta.get("edition") or "20th Edition"
    
    parts = ["Harrison's Manual of Medicine"]
    if edition:
        parts[0] += f" ({edition})"
    if ch_num and chapter:
        parts.append(f"Chapter {ch_num}: {chapter}")
    elif chapter:
        parts.append(str(chapter))
    if page:
        parts.append(f"p.{page}")
        
    return " — ".join(parts)

def query_model_direct(query_text, n_results=4):
    """Direct fast query against model/chroma.sqlite3 and chromadb store in model/"""
    if not os.path.exists(SQLITE_PATH):
        return []
    
    conn = sqlite3.connect(SQLITE_PATH)
    cur = conn.cursor()
    
    # Extract clean search tokens
    words = re.findall(r'[a-zA-Z0-9]{3,}', query_text.lower())
    stop_words = {'the', 'and', 'for', 'with', 'what', 'how', 'why', 'are', 'you', 'have', 'from', 'that', 'this', 'pain', 'help', 'can', 'should', 'about', 'some', 'when'}
    keywords = [w for w in words if w not in stop_words]
    if not keywords:
        keywords = words if words else [query_text]

    rows = []
    
    # 1. Try full query phrase
    query_pattern = f"%{query_text.strip()}%"
    rows = cur.execute(
        "SELECT id, c0 FROM embedding_fulltext_search_content WHERE c0 LIKE ? LIMIT ?", 
        (query_pattern, n_results)
    ).fetchall()
    
    # 2. Try multi-keyword combination
    if len(rows) < n_results and len(keywords) > 1:
        pattern = "%" + "%".join(keywords[:3]) + "%"
        more_rows = cur.execute(
            "SELECT id, c0 FROM embedding_fulltext_search_content WHERE c0 LIKE ? LIMIT ?", 
            (pattern, n_results - len(rows))
        ).fetchall()
        for r in more_rows:
            if r[0] not in [x[0] for x in rows]:
                rows.append(r)
                
    # 3. Try individual keywords
    if len(rows) < n_results:
        for kw in keywords[:4]:
            more_rows = cur.execute(
                "SELECT id, c0 FROM embedding_fulltext_search_content WHERE c0 LIKE ? LIMIT ?", 
                (f"%{kw}%", n_results - len(rows))
            ).fetchall()
            for r in more_rows:
                if r[0] not in [x[0] for x in rows]:
                    rows.append(r)
            if len(rows) >= n_results:
                break

    results = []
    for row in rows[:n_results]:
        content_id, doc_text = row[0], row[1]
        
        # Look up metadata from embedding_metadata
        meta_rows = cur.execute(
            "SELECT key, string_value, int_value, float_value FROM embedding_metadata WHERE id = ?", 
            (content_id,)
        ).fetchall()
        
        meta = {}
        for m in meta_rows:
            key, s_val, i_val, f_val = m
            val = s_val if s_val is not None else (i_val if i_val is not None else f_val)
            meta[key] = val
            
        results.append({
            "id": str(content_id),
            "document": doc_text,
            "metadata": meta,
            "distance": 0.15,
            "source": format_source(meta)
        })
        
    conn.close()
    return results

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps([]))
        sys.exit(0)
    query = sys.argv[1]
    n = int(sys.argv[2]) if len(sys.argv) > 2 else 4
    try:
        res = query_model_direct(query, n)
        print(json.dumps(res))
    except Exception as e:
        sys.stderr.write(str(e) + "\n")
        print(json.dumps([]))
