// >> Utils

function API(token) {
  return {
    token,
    apiUrl: "https://api.youneedabudget.com/v1",
  };
}

async function request(client, method, url, data) {
  if (!client.token) {
    throw new Error("Client token is required");
  }

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${client.token}`,
    },
    body: JSON.stringify(data),
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

// >> Budgets

async function getBudgets(client) {
  const response = await request(client, "GET", `${client.apiUrl}/budgets`);
  return response.data.budgets;
}

// >> Accounts

async function getAccounts(client, selectedBudgetId) {
  const response = await request(
    client,
    "GET",
    `${client.apiUrl}/budgets/${selectedBudgetId}/accounts`,
  );
  return response.data.accounts;
}

// >> Categories

async function getCategories(client, budgetId) {
  const response = await request(
    client,
    "GET",
    `${client.apiUrl}/budgets/${budgetId}/categories`,
  );
  return response.data.category_groups;
}

// >> Months

async function getBudgetMonths(client, budgetId) {
  const response = await request(
    client,
    "GET",
    `${client.apiUrl}/budgets/${budgetId}/months`,
  );
  return response.data.months;
}

// >> Transactions

async function getTransactionsByMonth(client, budgetId, month) {
  const response = await request(
    client,
    "GET",
    `${client.apiUrl}/budgets/${budgetId}/months/${month}/transactions`,
  );
  return response.data.transactions;
}

// >> API

window.ynab = {
  API,
  budgets: { getBudgets },
  accounts: { getAccounts },
  categories: { getCategories },
  months: { getBudgetMonths },
  transactions: { getTransactionsByMonth },
};
