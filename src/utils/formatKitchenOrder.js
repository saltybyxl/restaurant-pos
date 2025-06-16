export function formatKitchenOrder(tableName, items) {
  const header = `${tableName}\n------------------------\n`;

  const body = items
    .map((item) => {
      const line = `${item.quantity}× ${item.name}`;
      return item.notes
        ? `${line}     (${item.notes})`
        : line;
    })
    .join("\n");

  return header + body;
}
