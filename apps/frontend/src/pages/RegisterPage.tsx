import { useState } from "react";
import { useForm, zodResolver } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { z } from "zod";

const registerSchema = z.object({
  login: z.string().min(3, "Логин должен быть минимум 3 символа"),
  password: z.string()
    .min(8, "Пароль должен быть минимум 8 символов")
    .regex(/[A-Z]/, "Пароль должен содержать заглавную букву")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Пароль должен содержать спецсимвол")
    .regex(/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/, "Только латинские буквы"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<RegisterForm>({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(registerSchema),
  });

  const handleSubmit = async (values: RegisterForm) => {
    setIsLoading(true);
    setError("");
    try {
      console.log("Регистрация:", values);
      // Здесь будет вызов API
      // await register(values.login, values.password);
    } catch (err) {
      setError("Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Регистрация
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Логин"
              placeholder="Введите логин"
              {...form.getInputProps("login")}
            />
            
            <PasswordInput
              label="Пароль"
              placeholder="Введите пароль"
              {...form.getInputProps("password")}
            />
            
            <PasswordInput
              label="Повторите пароль"
              placeholder="Повторите пароль"
              {...form.getInputProps("confirmPassword")}
            />

            {error && <div style={{ color: "red" }}>{error}</div>}

            <Button type="submit" fullWidth loading={isLoading}>
              Зарегистрироваться
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};
