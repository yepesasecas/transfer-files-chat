defmodule Chat.RoomChannel do
  use Phoenix.Channel

  def join("rooms:lobby", _message, socket) do
    {:ok, socket}
  end

  def join("rooms:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "unaithorized"}}
  end

  def handle_in("new_chat_msg", %{"body" => body}, socket) do
    broadcast! socket, "new_chat_msg", %{body: body}
    {:noreply, socket}
  end

  def handle_in("new_file_line", %{"body" => body}, socket) do
    broadcast! socket, "new_file_line", %{body: body}
    {:noreply, socket}
  end

  def handle_in("progress", %{"body" => body}, socket) do
    broadcast! socket, "progress", %{body: body}
    {:noreply, socket}
  end
end
