import { createContext, useContext, useEffect, useState } from "react";

const MenuContext = createContext();

import { drinksMenu } from "../data/drinksData";
import { foodMenu } from "../data/foodData";

// Flatten the food and drinks into default flat array with name, price, category
const flattenMenu = (menuArray) => {
  return menuArray.flatMap((section) =>
    section.items.map((item) => ({ ...item, category: section.category }))
  );
};

const defaultMenu = {
  food: flattenMenu(foodMenu),
  drinks: flattenMenu(drinksMenu),
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
