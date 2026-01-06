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

// Logic for the `/api/hello` endpoint
export async function GET() {
  try {
    // Sending a request to the OpenAI create chat completion endpoint

    // Setting parameters for our request
    const createChatCompletionEndpointURL =
      "https://api.openai.com/v1/chat/completions";
    const promptText = `Write five variations of "Hello, World!"

Start each variation on a new line. Do not include additional information.

Here is an example:

Hello, World!
Bonjour, Earth!
Hey, Universe!
Hola, Galaxy!
G'day, World!`;
    const createChatCompletionReqParams = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: promptText }],
    };

    // Sending our request using the Fetch API
    const createChatCompletionRes = await fetch(
      createChatCompletionEndpointURL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + process.env.OPENAI_API_KEY,
        },
        body: JSON.stringify(createChatCompletionReqParams),
      },
    );

    // Processing the response body
    const createChatCompletionResBody = await createChatCompletionRes.json();

    // Error handling for the OpenAI endpoint
    if (createChatCompletionRes.status !== 200) {
      let error = new Error("Create chat completion request was unsuccessful.");
      error.statusCode = createChatCompletionRes.status;
      error.body = createChatCompletionResBody;
      throw error;
    }

    // Properties on the response body
    const completionText =
      createChatCompletionResBody.choices[0].message.content.trim();
    const usage = createChatCompletionResBody.usage;

    // Logging the results
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
