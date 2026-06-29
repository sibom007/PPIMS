export const HeaderCap = ({ title, disp }: { title: string; disp: string }) => {
  return (
    <div className="text-left">
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm sm:text-base text-muted-foreground ">{disp}</p>
    </div>
  );
};
