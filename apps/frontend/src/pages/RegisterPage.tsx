import { useState } from "react";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Paper, Title, Container, Stack } from "@mantine/core";
import { authApi } from "../api/auth";

interface RegisterForm {
  login: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const form = useForm<RegisterForm>({
    initialValues: {
      login: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      login: (value) => {
        if (!value || value.length < 3) {
          return "Логин должен быть минимум 3 символа";
        }
        return null;
      },
      password: (value) => {
        if (!value) return "Введите пароль";
        if (value.length < 8) return "Пароль должен быть минимум 8 символов";
        if (!/[A-Z]/.test(value)) return "Пароль должен содержать заглавную букву";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Пароль должен содержать спецсимвол";
        if (!/^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/.test(value)) return "Только латинские буквы";
        return null;
      },
      confirmPassword: (value, values) => {
        if (value !== values.password) {
          return "Пароли не совпадают";
        }
        return null;
      },
    },
  });

  const handleSubmit = async (values: RegisterForm) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      const response = await authApi.register({
        login: values.login,
        password: values.password,
      });
      
      console.log("Регистрация успешна:", response);
      setSuccess(true);
      
      // Перенаправляем на страницу логина через 2 секунды
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      const message = err.response?.data?.message || err.message || "Ошибка регистрации";
      setError(message);
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

        {success ? (
          <div style={{ textAlign: "center", color: "green" }}>
            <p> Регистрация успешна!</p>
            <p>Перенаправление на страницу входа...</p>
          </div>
        ) : (
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

              {error && (
                <div style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth loading={isLoading}>
                Зарегистрироваться
              </Button>
            </Stack>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "#666" }}>
          Уже есть аккаунт? <a href="/login" style={{ color: "#1a73e8", textDecoration: "none" }}>Войти</a>
        </div>
      </Paper>
    </Container>
  );
};
