using Microsoft.AspNetCore.SignalR;
using SignalChatPoC.Domain.Entities;
using SignalChatPoC.Features.Chat.Messages;
using SignalChatPoC.Features.Chat.Requests;

namespace SignalChatPoC.Features.Chat;

public class MessageHub : Hub<IMessageClient>
{
    public async Task Send(MessageRequest messageRequest)
    {
        var message = new Message
        {
            Id = Guid.NewGuid(),
            Content = messageRequest.Content,
            SentAt = messageRequest.SentAt,
            SenderId = Guid.NewGuid(),
            Sender = new User { Id = Guid.NewGuid(), Name = "Anonymous" },
        };

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

    public async Task SendToGroup(MessageToGroupRequest messageRequest)
    {
        var message = new Message
        {
            Id = Guid.NewGuid(),
            Content = messageRequest.Content,
            SentAt = messageRequest.SentAt,
            SenderId = Guid.NewGuid(),
            Sender = new User { Id = Guid.NewGuid(), Name = "Anonymous" },
            GroupName = messageRequest.GroupName
        };

        await Clients.OthersInGroup(messageRequest.GroupName).NewMessageSent(message);
    }

    public async Task AddToGroup(AddToGroupRequest request)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, request.GroupName);

        var message = new NewUserJoinedToGroupMessage { ConnectionId = Context.ConnectionId, GroupName = request.GroupName };
        await Clients.Group(request.GroupName).NewUserJoinedToGroup(message);
    }

    public async Task RemoveFromGroup(RemoveFromGroupRequest request)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, request.GroupName);

        var message = new UserRemovedFromGroupMessage { ConnectionId = Context.ConnectionId, GroupName = request.GroupName };
        await Clients.Group(request.GroupName).UserRemovedFromGroup(message);
    }
}