import { Server, Socket, Namespace } from 'socket.io';
import * as Y from 'yjs';
import { CollabService } from './collab.service';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

/**
 * Yjs gateway that syncs a Yjs document over a Socket.io namespace
 * and persists the document state to MongoDB.
 */
export class YjsGateway {
  private readonly io: Namespace;
  private readonly docs: Map<string, Y.Doc> = new Map();
  private readonly debouncedSaves: Map<string, () => void> = new Map();
  private readonly saveDelay = 2000; // ms

  constructor(io: Server) {
    this.io = io.of('/yjs');
    this.setup();
  }

  private setup() {
    this.io.on('connection', (socket: Socket) => {
      const { storyId } = socket.handshake.query as { storyId: string };
      if (!storyId) {
        socket.disconnect(true);
        return;
      }
      let doc = this.docs.get(storyId);
      if (!doc) {
        doc = new Y.Doc();
        this.docs.set(storyId, doc);
        // Load persisted state if any
        CollabService.getCollabState(storyId).then(state => {
        .catch(err => console.error(err))