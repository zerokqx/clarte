import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { authApi } from "../api/auth";

interface LoginForm {
  login: string;
  password: string;
}

export const LoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginForm>({
    initialValues: {
      login: "",
      password: "",
    },
    validate: {
      login: (value) => {
        if (!value || value.length < 3) {
          return "Введите логин";
        }
        return null;
      },
      password: (value) => {
        if (!value) return "Введите пароль";
        return null;
      },
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    setIsLoading(true);
    setError("");
    
    try {
      const response = await authApi.login({
        login: values.login,
        password: values.password,
      });
      
      console.log("Вход успешен:", response);
      
      // Перенаправляем на главную страницу
      window.location.href = "/";
      
    } catch (err: any) {
      console.error("Ошибка входа:", err);
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
