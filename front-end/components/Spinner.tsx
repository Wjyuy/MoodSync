// components/Spinner.tsx
export default function Spinner() {
  return (
    <div className="spinner">
      <style jsx>{`
        .spinner {
          margin: 100px auto;
          width: 40px;
          height: 40px;
          border: 4px solid #ccc;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
