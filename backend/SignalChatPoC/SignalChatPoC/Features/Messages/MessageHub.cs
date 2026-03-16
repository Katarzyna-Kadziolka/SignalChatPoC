using Microsoft.AspNetCore.SignalR;
using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Features.Messages;

public class MessageHub : Hub<IMessageClient>
{
    private static readonly List<Message> Messages = [];
    public async Task Send(MessageRequest messageRequest)
    {
        var message = new Message
        {
            Id = Guid.NewGuid(),
            Content = messageRequest.Content,
            SentAt = messageRequest.SentAt,
            SenderId = Guid.NewGuid(),
            Sender = new User { Id = Guid.NewGuid(), Name = "Anonymous" }
        };

        Messages.Add(message);
        await Clients.Others.NewMessageSent(message);
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