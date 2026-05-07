using SignalChatPoC.Features.Chat.Messages;

namespace SignalChatPoC.Features.Chat;

public interface IMessageClient
{
    Task NewMessageSent(Message messages);
    Task NewUserJoinedToGroup(NewUserJoinedToGroupMessage message);
    Task UserRemovedFromGroup(UserRemovedFromGroupMessage message);
}
