import { useState } from "react";
import { useForm, schemaResolver } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { z } from "zod";
import { authApi } from "../api/auth";

const loginSchema = z.object({
  login: z.string().min(1, "Введите логин"),
  password: z.string().min(1, "Введите пароль"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginForm>({
    initialValues: {
      login: "",
      password: "",
    },
    validate: schemaResolver(loginSchema, { sync: true }),
  });

  const handleSubmit = async (values: LoginForm) => {
    setIsLoading(true);
    setError("");
    
    try {
      await authApi.login({
        login: values.login,
        password: values.password,
      });
      window.location.href = "/";
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || "Неверный логин или пароль";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt={100}>
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg">
          Вход
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

            {error && (
              <div style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
                {error}
              </div>
            )}

            <Button type="submit" fullWidth loading={isLoading}>
              Войти
            </Button>
          </Stack>
        </form>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Нет аккаунта? <a href="/register" style={{ color: "#1a73e8", textDecoration: "none" }}>Зарегистрироваться</a>
        </div>
      </Paper>
    </Container>
  );
};
