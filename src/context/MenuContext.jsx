import { createContext, useContext, useEffect, useState } from "react";

const MenuContext = createContext();

const defaultMenu = {
  food: [
    { name: "Burger", price: 5.99, category: "Main" },
    { name: "Fries", price: 2.99, category: "Sides" },
  ],
  drinks: [
    { name: "Cola", price: 1.99, category: "Soft Drinks" },
    { name: "Water", price: 0.99, category: "Soft Drinks" },
  ],
};

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu");
    return saved ? JSON.parse(saved) : defaultMenu;
  });

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  const addItem = (type, item) => {
    setMenu((prev) => ({ ...prev, [type]: [...prev[type], item] }));
  };

  const updateItem = (type, index, updatedItem) => {
    setMenu((prev) => {
      const updatedList = [...prev[type]];
      updatedList[index] = updatedItem;
      return { ...prev, [type]: updatedList };
    });
  };

  const deleteItem = (type, index) => {
    setMenu((prev) => {
      const updatedList = [...prev[type]];
      updatedList.splice(index, 1);
      return { ...prev, [type]: updatedList };
    });
  };

  return (
    <MenuContext.Provider value={{ menu, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);
