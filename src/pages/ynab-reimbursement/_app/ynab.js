function API(token) {
  return {
    token,
    apiUrl: "https://api.youneedabudget.com/v1",
  };
}

async function request(client, { method, url, data, signal }) {
  if (!client.token) {
    throw new Error("Client token is required");
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${client.token}`,
    },
    body: data ? JSON.stringify(data) : undefined,
    signal,
  });

  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(
        `Error: ${errorData.error} - ${errorData.error_description}`,
      );
    } catch (_) {
      throw new Error(
        `Error: ${response.status} - ${response.statusText}`,
      );
    }
  }

  return response.json();
}

async function getBudgets(client, { signal } = {}) {
  const response = await request(client, {
    method: "GET",
    url: `${client.apiUrl}/budgets`,
    signal,
  });
  return response.data.budgets;
}

async function getAccounts(client, { budgetId, signal }) {
  const response = await request(client, {
    method: "GET",
    url: `${client.apiUrl}/budgets/${budgetId}/accounts`,
    signal,
  });
  return response.data.accounts;
}

async function getCategories(client, { budgetId, signal }) {
  const response = await request(client, {
    method: "GET",
    url: `${client.apiUrl}/budgets/${budgetId}/categories`,
    signal,
  });
  return response.data.category_groups;
}

async function getBudgetMonths(client, { budgetId, signal }) {
  const response = await request(client, {
    method: "GET",
    url: `${client.apiUrl}/budgets/${budgetId}/months`,
    signal,
  });
  return response.data.months;
}

async function getTransactionsByMonth(client, { budgetId, month, signal }) {
  const response = await request(client, {
    method: "GET",
    url: `${client.apiUrl}/budgets/${budgetId}/months/${month}/transactions`,
    signal,
  });
  return response.data.transactions;
}

export const ynab = {
  API,
  budgets: { getBudgets },
  accounts: { getAccounts },
  categories: { getCategories },
  months: { getBudgetMonths },
  transactions: { getTransactionsByMonth },
};
