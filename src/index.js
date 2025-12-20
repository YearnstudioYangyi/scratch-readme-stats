async function getUserInfo40c(id) {
  
  const url = `https://api.abc.520gxx.com/work/user?id=${id}&l=10000&token=`;

  try {
    // 使用 await 简化异步处理
    const response = await fetch(url);
    
    // 检查响应是否成功 (状态码 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // console.log(data);
    
    // 解析并返回 JSON 数据
    let data = await response.json();
    data = data.data;
    let likes = 0;
    let works = data.length;
    let looks = 0;
    if (works == 0){
      return { works: 0, likes: 0, looks: 0 };
    }
    for (let i = 0; i < data.length; i++) {
      likes += data[i].like;
      looks += data[i].look + data[i].oldlook;
    }
    
    return { works, likes, looks };
  } catch (error) {
    // 处理任何在请求或响应处理过程中发生的错误
    console.error("GET 请求或处理过程中发生错误:", error);
    // 返回默认值而不是抛出错误，避免整个请求失败
    return { works: 0, likes: 0 };
  }
}

async function getUserInfoZc(id) {
  const url = `https://zerocat-api.houlangs.com/searchapi?search_userid=${id}&search_orderby=view_up&search_state=public&curr=1&limit=10000`
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // console.log("GET 请求成功，正在解析 JSON...");
    const data = await response.json();
    const works = data.projects.length;
    const likes = data.projects.reduce((acc, cur) => acc + cur.star_count, 0);
    return { works, likes };
  }
  catch (error) {
    // console.error("GET 请求或处理过程中发生错误:", error);
    // 返回默认值而不是抛出错误，避免整个请求失败
    return { works: 0, likes: 0 };
  }
}

async function handleRequest(request) {
  return new Response('Hello World!');
}

export default {
  async fetch(request) {
    return handleRequest(request);
  }
};