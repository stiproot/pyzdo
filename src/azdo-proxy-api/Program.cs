using azdo_proxy_api.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAzdoProxyApiServices();

var app = builder.Build();

app.MapEndpoints();

app.Run();
