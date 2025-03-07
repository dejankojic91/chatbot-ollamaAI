import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";


interface ChatForm {
  message: string
}

const Chat = () => {
  
  const { register, handleSubmit } = useForm<ChatForm>();


  const conversationMutation = useMutation({
    mutationFn: async (data: ChatForm) => {
      return null
    },
    onSuccess: async () => {
      // await login({ email: data.email, password: data.password })
      // navigate("/chat");
    }
  })


  const onSubmit = (data: ChatForm) => {
    conversationMutation.mutate(data);
  }
  
  
  return (
    <div className="flex flex-col justify-end h-screen w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <Textarea {...register("message")} placeholder="Ask for any help" className="resize-none" />

        <Button type="submit" className="mt-2 w-full" >
          Send
        </Button>
      </form>
    </div>
  )
}

export default Chat