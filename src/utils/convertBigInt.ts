export const convertBigIntToString = (obj: any) => 
    JSON.parse(
      JSON.stringify(obj, (_, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );
  