export function ColorPicker({
  background,
  border,
  onClick,
}: {
  background: string;
  border: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`border ${border} p-[1px] hover:cursor-pointer rounded-md`}>
      <div className={`w-5 h-5 rounded-sm ${background}`}></div>
    </button>
  );
}
