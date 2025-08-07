export function transformDataFrameJsonToRows(dfJson: any): any[] {
  const { columns, data } = dfJson;
  return data.map((row: any[]) => {
    const rowObj: any = {};
    columns.forEach((col: string, i: number) => {
      rowObj[col] = row[i];
    });
    return rowObj;
  });
}