export const getMockRangeUsePlan = (number) => (
  {
    id: `RAN07123${number}`,
    number,
    status: number/3 <= 1 ? "Completed" : "Pending",
    region: `Victoria Ranch ${number}`,
    tenureHolder: {
      name: number%2 === 0 ? "Han Solo" : "Luke Skywalker"
    },
    rangeOfficer: {
      name: number%2 === 0 ? "Leia Organa" : "Obi-Wan Kenobi"
    }
  }
)

export const getMockRangeUsePlans = (length) => {
  const array = Array.from(new Array(length), (x,i) => i);
  return array.map(number => getMockRangeUsePlan(number + 1));
}
