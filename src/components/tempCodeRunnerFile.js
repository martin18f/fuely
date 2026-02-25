const FancyToggle = ({ checked, onChange }) => {
  return (
    <div> className="section"
    <StyledToggle>
      <input
        id="checkbox"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="Switch" htmlFor="checkbox"></label>
    </StyledToggle>
    </div>
  );
};