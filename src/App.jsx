// src/App.jsx
import { useState } from "react";
import TablesScreen from "./screens/TablesScreen";
import MenuScreen from "./screens/MenuScreen";
import OrdersScreen from "./screens/OrdersScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { OrderProvider } from "./context/OrderContext";
import TabNavigation from "./components/TabNavigation";
import { useSwipeable } from "react-swipeable";

const tabs = ["tables", "menu", "orders", "history"];

function App() {
  const [tab, setTab] = useState("tables");

  const currentIndex = tabs.indexOf(tab);
  const handlers = useSwipeable({
    onSwipedLeft: (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (currentIndex < tabs.length - 1) setTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        if (currentIndex > 0) setTab(tabs[currentIndex - 1]);
      }
    },
    preventScrollOnSwipe: true,
    trackTouch: true,
  });

  return (
    <OrderProvider>
      <div {...handlers} className="min-h-screen bg-gray-50 pb-24 overflow-hidden">
        <div className="pb-24">
          {tab === "tables" && <TablesScreen onTableSelect={() => setTab("menu")} />}
          {tab === "menu" && <MenuScreen />}
          {tab === "orders" && <OrdersScreen />}
          {tab === "history" && <HistoryScreen />}
        </div>
        <TabNavigation tab={tab} setTab={setTab} />
      </div>
    </OrderProvider>
  );
}

export default App;
