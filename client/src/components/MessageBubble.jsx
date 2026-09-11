import { formatTime } from "../utils";

export default function MessageBubble({ text, time, isOwn }) {
  return (
    <div className={`msg-row ${isOwn ? "out" : "in"}`}>
      <div className={`bubble ${isOwn ? "out" : "in"}`}>
        {text}
        <div className="bubble-time">{formatTime(time)}</div>
      </div>
    </div>
  );
}
