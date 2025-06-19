import { createContext, useContext, useState, useEffect } from "react";
import { foodMenu } from "../data/foodData";
import { drinksMenu } from "../data/drinksData";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const loadDefault = () => ({
    food: foodMenu.flatMap(section =>
      section.items.map(item => ({ ...item, category: section.category }))
    ),
    drinks: drinksMenu.flatMap(section =>
      section.items.map(item => ({ ...item, category: section.category }))
    ),
  });

  const [menu, setMenu] = useState(() => {
    const saved = localStorage.getItem("menu");
    return saved ? JSON.parse(saved) : loadDefault();
  });

  useEffect(() => {
    localStorage.setItem("menu", JSON.stringify(menu));
  }, [menu]);

  const addItem = (type, item) => {
    setMenu(prev => ({
      ...prev,
      [type]: [...prev[type], item],
    }));
  };

  const updateItem = (type, index, updated) => {
    setMenu(prev => {
      const updatedItems = [...prev[type]];
      updatedItems[index] = updated;
      return { ...prev, [type]: updatedItems };
    });
  };

  const deleteItem = (type, index) => {
    setMenu(prev => {
      const updatedItems = [...prev[type]];
      updatedItems.splice(index, 1);
      return { ...prev, [type]: updatedItems };
    });
  };

  return (
    <MenuContext.Provider value={{ menu, addItem, updateItem, deleteItem }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
