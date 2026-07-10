import mossyMascot from "../assets/illustrations/mossy-mascot.webp";

// MossyAvatar shows the original watercolor mascot asset. Keeping this as a
// component means every Mossy card can use the same image and sizing rules.
export function MossyAvatar({ size = "medium" }) {
  return (
    <span className={`mossy-avatar mossy-avatar-${size}`} aria-hidden="true">
      <img className="mossy-avatar-image" src={mossyMascot} alt="" />
    </span>
  );
}
