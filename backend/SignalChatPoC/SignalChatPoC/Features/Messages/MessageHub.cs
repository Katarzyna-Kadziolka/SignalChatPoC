using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using SignalChatPoC.Domain.Entities;
using SignalChatPoC.Infrastructure.Persistence;

namespace SignalChatPoC.Features.Messages;

public class MessageHub(DataContext dataContext) : Hub<IMessageClient>
{
    public async Task Send(Message message)
    {
        dataContext.Messages.Add(message);
        await dataContext.SaveChangesAsync();
        
        await EmitLastMessages();
    }
    
    public async Task EmitLastMessages()
    {
        var messages = dataContext.Messages
            .Include(m => m.Sender)
            .OrderByDescending(m => m.SentAt)
            .Take(10)
            .ToList();

        await Clients.All.Pending(messages);
    }

    public override async Task OnConnectedAsync()
    {
        Console.WriteLine(Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? ex)
    {
        Console.WriteLine(Context.ConnectionId);
        await base.OnDisconnectedAsync(ex);
    }
}