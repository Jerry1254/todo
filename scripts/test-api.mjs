import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
let cookies = [];

// 辅助函数：从响应中获取 cookie
function getCookiesFromResponse(response) {
  const rawCookies = response.headers.raw()['set-cookie'];
  if (rawCookies) {
    cookies = rawCookies;
  }
}

// 辅助函数：将 cookie 添加到请求头
function getHeaders(contentType = 'application/json') {
  const headers = {
    'Content-Type': contentType,
  };
  if (cookies.length > 0) {
    headers.Cookie = cookies.join('; ');
  }
  return headers;
}

// 辅助函数：处理响应
async function handleResponse(response) {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  const text = await response.text();
  console.error('非 JSON 响应:', text);
  throw new Error('服务器返回了非 JSON 响应');
}

async function register() {
  console.log('\n1. 测试注册...');
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      username: 'testuser2',
      password: 'testpass123'
    })
  });

  const data = await handleResponse(response);
  console.log('注册结果:', data);
  return data;
}

async function login() {
  console.log('\n2. 测试登录...');
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      username: 'testuser2',
      password: 'testpass123'
    })
  });

  getCookiesFromResponse(response);
  const data = await handleResponse(response);
  console.log('登录结果:', data);
  return data;
}

async function createCategory() {
  console.log('\n3. 创建类别...');
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      name: 'Work',
      color: 'bg-[#46cf8b]/10',
      textColor: 'text-[#46cf8b]',
      icon: 'briefcase'
    })
  });

  const data = await handleResponse(response);
  console.log('创建类别结果:', data);
  return data;
}

async function getCategories() {
  console.log('\n4. 获取所有类别...');
  const response = await fetch(`${BASE_URL}/categories`, {
    headers: getHeaders()
  });
  const data = await handleResponse(response);
  console.log('类别列表:', data);
  return data;
}

async function createTodo() {
  console.log('\n5. 创建待办事项...');
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      text: '完成API测试',
      category: 'Work',
      date: '2024-01-05',
      startTime: '14:00',
      duration: 2,
      subtasks: [
        {
          text: '测试创建功能',
          category: 'Work',
          date: '2024-01-05',
          completed: false
        }
      ]
    })
  });

  const data = await handleResponse(response);
  console.log('创建待办事项结果:', data);
  return data;
}

async function getTodos() {
  console.log('\n6. 获取所有待办事项...');
  const response = await fetch(`${BASE_URL}/todos`, {
    headers: getHeaders()
  });
  const data = await handleResponse(response);
  console.log('待办事项列表:', data);
  return data;
}

async function updateTodo(id) {
  console.log('\n7. 更新待办事项...');
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({
      completed: true
    })
  });

  const data = await handleResponse(response);
  console.log('更新待办事项结果:', data);
  return data;
}

async function deleteTodo(id) {
  console.log('\n8. 删除待办事项...');
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  const data = await handleResponse(response);
  console.log('删除待办事项结果:', data);
  return data;
}

async function runTests() {
  try {
    // 注册新用户
    const newUser = await register();
    if (!newUser || newUser.error) {
      console.log('注册失败，尝试直接登录');
    }
    
    // 登录
    const user = await login();
    if (!user || user.error) {
      throw new Error('登录失败');
    }

    // 创建和获取类别
    const category = await createCategory();
    if (!category.error) {
      await getCategories();
    }

    // 创建和管理待办事项
    const todo = await createTodo();
    if (!todo.error) {
      await getTodos();
      if (todo.id) {
        await updateTodo(todo.id);
        await deleteTodo(todo.id);
      }
    }

    console.log('\n测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
runTests();
