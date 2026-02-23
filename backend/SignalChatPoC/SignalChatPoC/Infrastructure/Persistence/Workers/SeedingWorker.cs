using Microsoft.EntityFrameworkCore;
using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Infrastructure.Persistence.Workers;

public class SeedingWorker(IServiceScopeFactory scopeFactory) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await SeedDataAsync();
    }

    private async Task SeedDataAsync()
    {
        using var scope = scopeFactory.CreateScope();
        await using var context = scope.ServiceProvider.GetRequiredService<DataContext>();
        await context.Database.EnsureDeletedAsync();
        await context.Database.MigrateAsync();
        
        var users = new List<User>
        {
            new() { Id = Guid.NewGuid(), Name = "Alice" },
            new() { Id = Guid.NewGuid(), Name = "Bob" },
            new() { Id = Guid.NewGuid(), Name = "Charlie" }
        };

        var messages = new List<Message>
        {
            new() { SentAt = DateTime.UtcNow, SenderId = users[0].Id, Content = "Hello, Bob!" },
            new() { SentAt = DateTime.UtcNow, SenderId = users[1].Id, Content = "Hi, Alice!" }
        };
        
        await context.Users.AddRangeAsync(users);
        await context.SaveChangesAsync();
    }
}