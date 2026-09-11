import { initialsOf } from "../utils";

export default function Avatar({ name, color = "#5b6ef5", size = 44, online }) {
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, background: color, fontSize: size * 0.4 }}
    >
      {initialsOf(name)}
      {online && <span className="dot" />}
    </div>
  );
}
