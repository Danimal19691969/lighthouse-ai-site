export default function GradientBackground() {
  return (
    <div className="absolute inset-0 w-full min-h-full">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, hsla(229, 31%, 20%, 1) 0%, hsla(194, 58%, 33%, 1) 15%, hsla(201, 57%, 13%, 1) 44%, hsla(213, 42%, 31%, 1) 74%, hsla(214, 39%, 12%, 1) 100%)'
        }}
      />
    </div>
  );
}
