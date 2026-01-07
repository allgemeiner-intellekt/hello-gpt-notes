/**
 * 解读 Next.js App Router 的文件夹结构设计
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │                    文件夹结构对应关系                                │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │                                                                     │
 * │   app/api/hello/route.js  →  对应访问路径:  /api/hello              │
 * │                              (即: 域名/api/hello)                   │
 * │                                                                     │
 * │   app/            →  Next.js App Router 的根文件夹                  │
 * │   └─ api/         →  专门放 API 接口的文件夹                        │
 * │       └─ hello/   →  你想要创建的接口名称                           │
 * │           └─ route.js  →  定义这个接口的具体代码                    │
 * │                                                                     │
 └─────────────────────────────────────────────────────────────────────┘
 *
 * 【为什么要这样设计？】
 *
 * 1. 约定优于配置 (Convention over Configuration)
 *    - Next.js 采用"文件系统即路由"的设计理念
 *    - 你不需要额外配置路由表，文件夹结构直接决定了访问路径
 *    - 把文件放在哪里，路径就是什么——就像把文件放在抽屉的哪一层
 *
 * 2. app/api/ 的作用
 *    - api 文件夹告诉 Next.js："这里全是后端接口"
 *    - 所有放在 api/ 下的文件，都会被自动识别为 API 路由
 *    - 这些接口不需要渲染页面，只是返回数据（JSON）
 *
 * 3. hello/ 的作用
 *    - 这是接口的名字，决定了 URL 路径的最后一段
 *    - 文件夹名叫 hello，访问路径就是 /api/hello
 *    - 如果想创建 /api/users，就创建 app/api/users/route.js
 *
 * 4. route.js 的作用
 *    - Next.js 保留文件名，必须叫 route.js
 *    - 这个文件里可以导出 GET/POST/PUT/DELETE 等函数
 *    - GET() 处理 GET 请求，POST() 处理 POST 请求，以此类推
 *
 * 【类比理解】
 *    想象一个图书馆的索引系统：
 *    - app/api/ 就像是"技术书籍区"
 *    - hello/ 就像是"Hello World 专题书架"
 *    - route.js 就像是书架上的"书籍目录卡"
 *
 *    别人想找这个接口，只需要知道路径 /api/hello，就像在图书馆找书一样直观。
 *
 * 【总结】
 *    这种设计让 API 路由变得像写文件一样简单——放在哪里，路径就是哪里。
 *    无需额外配置，降低了出错概率，也让项目结构一目了然。
 */

export const dynamic = "force-dynamic";
// export: 导出变量让 Next.js 能"看到"它
// const: 声明常量（值不可变）
// 作用：禁用缓存，每次请求都执行代码获取新数据
// 可选值: force-static(永远缓存), force-dynamic(从不缓存), auto(自动判断)

// Logic for the `/api/hello` endpoint
// 关键字: export (导出), async (异步), function (函数)。定义一个名为 GET 的异步函数。
// 为什么: Next.js App Router 约定使用 HTTP 方法名（如 GET）作为导出函数来处理对应请求。
export async function GET() {
  // 关键字: try (尝试)。开始一个错误捕获块。
  // 为什么: 网络请求和外部 API 调用可能会失败，我们需要捕获这些异常以防止程序崩溃。
  try {
    // Sending a request to the OpenAI create chat completion endpoint

    // Setting parameters for our request
    // 关键字: const (常量)。定义 OpenAI 的 API 端点 URL。
    // 为什么: 将 URL 存储在变量中，方便后续调用 fetch 时使用，也便于维护。
    const createChatCompletionEndpointURL =
      "https://api.openai.com/v1/chat/completions";
    // 关键字: const (常量), template literal (模板字符串)。定义发送给 AI 的提示词。
    // 为什么: 这是核心业务逻辑，明确指示 AI 生成 5 种 "Hello, World!" 的变体。
    const promptText = `Write five variations of "Hello, World!"

Start each variation on a new line. Do not include additional information.

Here is an example:

Hello, World!
Bonjour, Earth!
Hey, Universe!
Hola, Galaxy!
G'day, World!`;
    // 关键字: const (常量), object (对象)。构建请求参数对象。
    // 为什么: OpenAI API 需要特定的 JSON 结构，包含模型名称 (gpt-3.5-turbo) 和消息历史。
    const createChatCompletionReqParams = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptText }],
    };

    // Sending our request using the Fetch API
    // 关键字: const (常量), await (等待), fetch (发起网络请求)。发送 HTTP 请求。
    // 为什么: await 暂停执行直到请求完成，fetch 是标准的 Web API，用于与外部服务（OpenAI）通信。
    const createChatCompletionRes = await fetch(
      createChatCompletionEndpointURL,
      {
        // 关键字: method (方法)。指定 HTTP 动词为 POST。
        // 为什么: OpenAI 接口要求使用 POST 方法来提交数据。
        method: "POST",
        // 关键字: headers (请求头)。定义请求的元数据。
        // 为什么: 告知服务器我们发送的是 JSON 数据，并提供身份验证凭证。
        headers: {
          "Content-Type": "application/json",
          // 关键字: process.env (环境变量)。读取 API 密钥。
          // 为什么: 从环境变量读取密钥是安全最佳实践，避免将敏感信息硬编码在代码中。
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        // 关键字: body (请求体), JSON.stringify (序列化)。
        // 为什么: 将 JavaScript 对象转换为 JSON 字符串，因为 HTTP 协议传输文本数据。
        body: JSON.stringify(createChatCompletionReqParams),
      },
    );

    // Processing the response body
    // 关键字: const, await, .json()。解析响应体。
    // 为什么: 服务器返回的是数据流，需要解析成 JavaScript 对象才能访问其中的数据。
    const createChatCompletionResBody = await createChatCompletionRes.json();

    // Error handling for the OpenAI endpoint
    // 关键字: if (条件判断), .status (状态码)。检查请求是否成功。
    // 为什么: 即使 fetch 没有报错，API 也可能返回 4xx 或 5xx 错误（如密钥无效），需要手动处理。
    if (createChatCompletionRes.status !== 200) {
      // 关键字: let, new Error (创建错误对象)。
      // 为什么: 创建一个自定义错误对象，以便稍后在 catch 块中统一处理。
      let error = new Error("Create chat completion request was unsuccessful.");
      // 关键字: 赋值。附加状态码信息。
      // 为什么: 保留原始错误状态码，以便调试或返回给客户端。
      error.statusCode = createChatCompletionRes.status;
      // 关键字: 赋值。附加响应体详情。
      // 为什么: 响应体通常包含具体的错误原因（如 "Quota exceeded"）。
      error.body = createChatCompletionResBody;
      // 关键字: throw (抛出)。
      // 为什么: 中断当前执行流，直接跳转到 catch 块进行错误处理。
      throw error;
    }

    // Properties on the response body
    // 关键字: const, 链式访问, .trim() (去空格)。提取 AI 回复的文本。
    // 为什么: OpenAI 的响应结构嵌套较深，我们需要提取出实际生成的文本内容并清理首尾空格。
    const completionText =
      createChatCompletionResBody.choices[0].message.content.trim();
    // 关键字: const。提取 Token 使用量。
    // 为什么: 记录 Token 使用情况对于成本监控和配额管理非常重要。
    const usage = createChatCompletionResBody.usage;

    // Logging the results
    // 关键字: console.log (打印日志), template literal。
    // 为什么: 在服务端控制台输出日志，有助于开发调试和监控生产环境的运行状态。
    console.log(`Create chat completion request was successful. Results:
Completion:

${completionText}

Token usage:
Prompt: ${usage.prompt_tokens}
Completion: ${usage.completion_tokens}
Total: ${usage.total_tokens}
`);

    // Sending a successful response for our endpoint
    return new Response(JSON.stringify({ completion: completionText }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Error handling

    // Server-side error logging
    console.log(`Thrown error: ${error.message}
Status code: ${error.statusCode}
Error: ${JSON.stringify(error.body)}
`);

    // Sending an unsuccessful response for our endpoint
    return new Response(
      JSON.stringify({ error: { message: "An error has occurred" } }),
      {
        status: error.statusCode || "500",
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
