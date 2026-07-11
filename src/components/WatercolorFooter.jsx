import mountainFooter from "../assets/illustrations/mountain-footer.png";

// WatercolorFooter is decorative only. It gives each tab a soft painted ending
// without affecting navigation, data, or any interactive StudySprout feature.
export function WatercolorFooter() {
  return (
    <div className="watercolor-footer" aria-hidden="true">
      <img src={mountainFooter} alt="" />
    </div>
  );
}
