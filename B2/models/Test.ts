interface Car {
  brand: string;
  hp: number;
}

const myCar: Car = {
  brand: "Honda",
  hp: 200
};

console.log("TypeScript works!", myCar);
export default myCar;