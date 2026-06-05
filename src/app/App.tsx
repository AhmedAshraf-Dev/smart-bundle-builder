import { BuildProvider } from "./context/BuildContext";
import AppUI from "./AppUI";

export default function App() {
  return (
    <BuildProvider>
      <AppUI />
    </BuildProvider>
  );
}
