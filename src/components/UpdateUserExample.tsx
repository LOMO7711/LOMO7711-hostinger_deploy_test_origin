import { Button, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Zod, { ZodError } from "zod";
import { User, useSetUser, useUser } from "../atoms/userAtom";
import useRequest, { ApiErrors } from "../hooks/useRequest";
import { ErrorInfos, translateZodError } from "../utils/errors";
import BaseInput from "./base/BaseInput";
type UpdateableUserData = {
  age?: string;
  name: string;
  nickName?: string;
  money?: string;
};

function tostring(value: number | undefined) {
  if ("number" === typeof value) return value.toString();
  return value;
}

function createFormvalues(user: User) {
  return {
    name: user.name,
    nickName: user.nickName,
    age: tostring(user.age || 0),
    money: tostring(user.money || 0),
  };
}

function formatFormresult(data: Partial<UpdateableUserData>): Partial<User> {
  const res: Partial<User> = {};
  if (typeof data.nickName === "string") res.nickName = data.nickName;
  if (data.age === "string") res.age = parseInt(data.age);
  if (data.money === "string") res.money = parseInt(data.money);
  if (data.name === "string") res.name = data.name;

  return res;
}

function createValdiator() {
  const nameParser = Zod.string().min(3, "to_short").max(50, "to_long");
  const ageParser = Zod.number().min(18, "to_small").max(120, "to_big");
  const moneyParser = Zod.number().min(0, "to_small").max(10000000, "to_big");
  return {
    name: (name: string | undefined) => {
      try {
        nameParser.parse(name);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("name", error);
      }
    },
    nickName: (name: string | undefined) => {
      try {
        nameParser.parse(name);
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("nickName", error);
      }
    },

    age: (age: string | undefined) => {
      try {
        ageParser.parse(!age || !age.length ? 0 : parseInt(age));
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("age", error);
      }
    },
    money: (money: string | undefined) => {
      try {
        moneyParser.parse(!money || !money.length ? 0 : parseInt(money));
        return true;
      } catch (e) {
        const error = e as ZodError;
        return translateZodError("money", error);
      }
    },
  };
}

const fields: Array<{
  name: keyof UpdateableUserData;
  type?: string;
  placeholder?: HTMLInputElement["placeholder"];
}> = [
  { name: "name", placeholder: "Name" },
  { name: "nickName", placeholder: "Nickname" },
  { name: "money", type: "number", placeholder: "Money" },
  { name: "age", type: "number", placeholder: "Age" },
];
export default function UpdateUserExample() {
  const user = useUser() as User;
  const setUser = useSetUser();
  const methods = useForm<UpdateableUserData>({
    defaultValues: createFormvalues(user),
  });
  const {
    handleSubmit,
    setError,
    formState: { dirtyFields, isDirty },
  } = methods;
  const [{ isLoading }, onApiRequest] = useRequest((errors: ApiErrors) => {
    Object.keys(errors).forEach((key) => {
      if (fields.some(({ name }) => name === key)) {
        setError(key as keyof UpdateableUserData, {
          message: errors[key],
          type: "manual",
        });
      } else {
        setError(`root.${key}`, {
          type: "manual",
          message: errors[key],
        });
      }
    });
  });
  async function onSubmit(data: UpdateableUserData) {
    try {
      const up: Partial<UpdateableUserData> = {};
      for (const key of Object.keys(dirtyFields) as [
        keyof Partial<UpdateableUserData>,
      ]) {
        if (key in dirtyFields) {
          up[key] = data[key];
        }
      }
      const body = formatFormresult(up);
      const response = await onApiRequest("users/update", {
        method: "POST",
        body,
      });
      const { fields } = response.data as {
        fields: [keyof User];
        errors: { [key in keyof User]: ErrorInfos };
      };

      const userUpdate: Partial<User> = {};
      fields.forEach((field) => {
        if (body[field]) Object.assign(userUpdate, { [field]: body[field] });
      });
      setUser((prev) => ({ ...prev, ...userUpdate }));
    } catch (e) {
      console.error("error in update user", e);
    }
  }

  useEffect(() => {
    methods.reset(createFormvalues(user));
  }, [user]);

  const validator = createValdiator();

  return (
    <FormProvider {...methods}>
      <Stack>
        {fields.map((e, i) => {
          return (
            <BaseInput<UpdateableUserData>
              validate={validator[e.name]}
              key={i}
              name={e.name}
              placeholder={e.placeholder}
              RenderErrorMessage={({ text }) => {
                return (
                  <Text color="red">Custom Error Component here :: {text}</Text>
                );
              }}
              type={e?.type}
            />
          );
        })}

        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isLoading || !isDirty}
          loading={isLoading}
        >
          Speichern
        </Button>
      </Stack>
    </FormProvider>
  );
}
