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
            Sender = new User { Id = Guid.NewGuid(), Name = "Anonymous" },
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
        Messages.Add(message);

        await Clients.Group(messageRequest.GroupName).NewMessageSent(message);
    }

    public async Task AddToGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var message = new NewUserJoinedToGroupMessage { ConnectionId = Context.ConnectionId, GroupName = groupName };
        await Clients.Group(groupName).NewUserJoinedToGroup(message);
    }

    public async Task RemoveFromGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);

        var message = new UserRemovedFromGroupMessage { ConnectionId = Context.ConnectionId, GroupName = groupName };
        await Clients.Group(groupName).UserRemovedFromGroup(message);
    }
}