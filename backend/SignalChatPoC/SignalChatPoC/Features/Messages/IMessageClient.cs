namespace SignalChatPoC.Features.Messages;

public interface IMessageClient
{
    Task NewMessageSent(Message messages);
    Task NewUserJoinedToGroup(NewUserJoinedToGroupMessage message);
    Task UserRemovedFromGroup(UserRemovedFromGroupMessage message);
}
