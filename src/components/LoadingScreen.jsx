// src/components/LoadingScreen.jsx
export default function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontSize: "2em",
        zIndex: 1000,
      }}
    >
      Loading...
    </div>
  );
}
