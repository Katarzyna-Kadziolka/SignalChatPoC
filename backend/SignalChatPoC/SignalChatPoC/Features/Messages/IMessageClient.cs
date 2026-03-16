using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Features.Messages;

public interface IMessageClient
{
    Task NewMessageSent(Message messages);
}
