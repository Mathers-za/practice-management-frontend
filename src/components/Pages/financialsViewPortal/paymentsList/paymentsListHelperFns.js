import axios from "axios";

export function filterPaymentsData(paymentsData, searchBarInput) {
  const filteredData = paymentsData.filter((payment) => {
    const values = Object.values(payment);
    return values.some((value) => {
      if (value === null || value === undefined) {
        return false;
      } else if (typeof value !== "string") {
        return value
          .toString()
          .toLowerCase()
          .includes(searchBarInput.toLowerCase());
      } else {
        return value
          .toLocaleLowerCase()
          .includes(searchBarInput.toLocaleLowerCase());
      }
    });
  });
  return filteredData;
}

export async function fetchData(pageInt, pageSizeInt, filterCriteriaObj) {
  const response = await axios.get(
    `http://localhost:4000/payments/filterview`,
    {
      params: {
        page: pageInt,
        pageSize: pageSizeInt,
        filterCriteria: filterCriteriaObj,
      },
      withCredentials: true,
    }
  );

  return response.data;
}
