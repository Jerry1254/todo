// @ts-ignore
import fetch from 'node-fetch';

interface User {
  id: string;
  username: string;
}

interface Todo {
  id: string;
  text: string;
  category: string;
  completed: boolean;
  date: string;
  startTime?: string;
  duration?: number;
  subtasks?: Todo[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  textColor: string;
  icon: string;
}

const BASE_URL = 'http://localhost:3000/api';
let authToken: string;

async function register() {
  console.log('\n1. 测试注册...');
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'testpass123'
    })
  });

  const data = await response.json();
  console.log('注册结果:', data);
  return data;
}

async function login() {
  console.log('\n2. 测试登录...');
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'testuser',
      password: 'testpass123'
    })
  });

  const data = await response.json();
  console.log('登录结果:', data);
  return data;
}

async function createCategory() {
  console.log('\n3. 创建类别...');
  const response = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Work',
      color: 'bg-[#46cf8b]/10',
      textColor: 'text-[#46cf8b]',
      icon: 'briefcase'
    })
  });

  const data = await response.json();
  console.log('创建类别结果:', data);
  return data;
}

async function getCategories() {
  console.log('\n4. 获取所有类别...');
  const response = await fetch(`${BASE_URL}/categories`);
  const data = await response.json();
  console.log('类别列表:', data);
  return data;
}

async function createTodo() {
  console.log('\n5. 创建待办事项...');
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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

  const data = await response.json();
  console.log('创建待办事项结果:', data);
  return data;
}

async function getTodos() {
  console.log('\n6. 获取所有待办事项...');
  const response = await fetch(`${BASE_URL}/todos`);
  const data = await response.json();
  console.log('待办事项列表:', data);
  return data;
}

async function updateTodo(id: string) {
  console.log('\n7. 更新待办事项...');
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      completed: true
    })
  });

  const data = await response.json();
  console.log('更新待办事项结果:', data);
  return data;
}

async function deleteTodo(id: string) {
  console.log('\n8. 删除待办事项...');
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE'
  });

  const data = await response.json();
  console.log('删除待办事项结果:', data);
  return data;
}

async function runTests() {
  try {
    // 注册新用户
    await register();
    
    // 登录
    const loginResult = await login();
    const user = loginResult as User;
    if (!user) {
      throw new Error('登录失败');
    }

    // 创建和获取类别
    await createCategory();
    await getCategories();

    // 创建和管理待办事项
    const createResult = await createTodo();
    const todo = createResult as Todo;
    if (todo.id) {
      await updateTodo(todo.id);
      await deleteTodo(todo.id);
    }

    console.log('\n测试完成！');
  } catch (error) {
    console.error('测试过程中出错:', error);
  }
}

// 运行测试
runTests();
