# AI Chat RAG Integration — Task List

- [x] Detect ChromaDB collection name (`harrisons_manual_20e`)
- [/] Build Python FastAPI sidecar (`model/chroma_server.py`)
- [ ] Add `requirements.txt` for sidecar
- [ ] Update `.env.example` + `.env.local` with CHROMA_SERVER_URL
- [ ] Create `src/lib/chroma-client.ts`
- [ ] Create `src/lib/medical-context.ts`
- [ ] Update `/api/chat/route.ts` (RAG pipeline + source extraction)
- [ ] Update `AIChatPage.tsx` (send userId, render sources panel)
- [ ] Verify dev server builds cleanly
