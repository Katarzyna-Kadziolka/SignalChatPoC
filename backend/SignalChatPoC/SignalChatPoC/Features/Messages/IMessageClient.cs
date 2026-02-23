using SignalChatPoC.Domain.Entities;

namespace SignalChatPoC.Features.Messages;

public interface IMessageClient
{
    Task Pending(List<Message> messages);
}