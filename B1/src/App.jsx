// B1/src/App.jsx
import { useState } from 'react';
import axios from 'axios';

function App() {
  // 1. 定义状态，存用户输入
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  // 2. 处理输入框变化
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. 🔥 核心：提交表单，联调后端
  const handleSubmit = async (e) => {
    e.preventDefault(); // 阻止页面刷新
    try {
      // 假设你的后端跑在 8000 端口，路由是 /api/users/register
      // 请根据你的实际情况修改 URL
      const response = await axios.post('http://localhost:8000/api/users/register', formData);

      console.log("后端返回:", response.data);
      setMessage("注册成功！ID: " + response.data.data.user._id); // 假设你后端返回结构是这样
    } catch (error) {
      console.error("出错了:", error);
      // 辩证地看：报错也是一种信息
      setMessage("注册失败: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>用户注册 (MVP)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>用户名: </label>
          <input 
            name="username" 
            type="text" 
            onChange={handleChange} 
            required 
          />
        </div>
        <br />
        <div>
          <label>邮箱: </label>
          <input 
            name="email" 
            type="email" 
            onChange={handleChange} 
            required 
          />
        </div>
        <br />
        <div>
          <label>密码: </label>
          <input 
            name="password" 
            type="password" 
            onChange={handleChange} 
            required 
          />
        </div>
        <br />
        <button type="submit">注册</button>
      </form>
      {message && <p style={{ color: message.includes('失败') ? 'red' : 'green' }}>{message}</p>}
    </div>
  );
}

export default App;