import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as duration from 'dayjs/plugin/duration';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { BadRequestException, HttpStatus } from '@nestjs/common';

dayjs.extend(utc);
dayjs.extend(duration);

/**
 * map object to given clazz
 * excludeExtraneousValues: true - skips properties that doesn't exist in clazz but exists in obj, will require @Expose() decorat
 */
export const cast = async <T>(
  clazz: ClassConstructor<T>,
  obj: object,
): Promise<T> => {
  try {
    const toClass = plainToClass(clazz, obj, {
      excludeExtraneousValues: false,
    });
    await validateOrReject(toClass as unknown as object);
    return toClass;
  } catch (error) {
    console.log(error);
    const message = error?.map(
      (nth: Record<any, any>) =>
        nth.constraints || `format error on ${nth.property} property`,
    ) || [HttpStatus.INTERNAL_SERVER_ERROR];
    throw new BadRequestException(message);
  }
};

export const enumVals = (_enum: { [x: string]: any }): string[] => {
  return Object.keys(_enum)
    .map((key) => _enum[key])
    .filter((key) => typeof key === 'string');
};

export const getServerTime = () => {
  return dayjs.utc();
};

// ref: https://github.com/norbornen/execution-time-decorator/blob/master/src/index.ts
export function logtime(
  target: any,
  propertyKey: string,
  propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {
  propertyDescriptor =
    propertyDescriptor || Object.getOwnPropertyDescriptor(target, propertyKey);

  const timername =
    (target instanceof Function
      ? `static ${target.name}`
      : target.constructor.name) + `::${propertyKey}`;
  const originalMethod = propertyDescriptor.value;
  propertyDescriptor.value = async function (...args: any[]) {
    const start = getServerTime();
    console.log(`[logtime] [${timername}]: begin`);
    try {
      const result = await originalMethod.apply(this, args);
      console.log(
        `[logtime] [${timername}]: ${dayjs
          .duration(getServerTime().diff(start))
          .asSeconds()}s`,
      );
      return result;
    } catch (err) {
      console.log(
        `[logtime] [${timername}]: ${dayjs
          .duration(getServerTime().diff(start))
          .asSeconds()}s`,
      );
      throw err;
    }
  };
  return propertyDescriptor;
}

// Note: send information via webhook
export const sendToSlack = async (text: string) => {
  console.log(`Sending message: ${text}`);
  const { SLACK_WEBHOOK, ENV } = process.env;
  if (ENV !== 'prod') return;
  await lastValueFrom(
    new HttpService().post(
      SLACK_WEBHOOK,
      { text },
      { headers: { 'Content-Type': 'application/json' } },
    ),
  );
};

export type GenericClass<T = any> = new (...args: any[]) => T;

export const toMb = (size: number) => size * 1024 * 1024;

export const nullable = true;
