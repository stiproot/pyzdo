using Azdo.Proxy.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAzdoProxyApiServices();

var app = builder.Build();

app.MapEndpoints();

app.Run();
