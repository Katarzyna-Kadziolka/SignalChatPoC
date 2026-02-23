using Microsoft.EntityFrameworkCore;
using SignalChatPoC.Features.Chat;
using SignalChatPoC.Features.Messages;
using SignalChatPoC.Infrastructure.Persistence;
using SignalChatPoC.Infrastructure.Persistence.Workers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddDbContext<DataContext>(options => options.UseSqlite("Data Source=mydatabase.sqlite"));
builder.Services.AddHostedService<SeedingWorker>();
builder.Services.AddSignalR();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<MessageHub>("/messagehub");

app.Run();