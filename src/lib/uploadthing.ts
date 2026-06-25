import sharp from "sharp";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

const logoTypes = new Set(["image/svg+xml", "image/png", "image/jpeg", "image/webp"]);

function slugifyFileName(name: string) {
  const [base = "file", ...rest] = name.toLowerCase().split(".");
  const extension = rest.pop();
  const safeBase = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";

  return extension ? `${safeBase}.${extension.replace(/[^a-z0-9]/g, "")}` : safeBase;
}

export function companyUploadCustomId(companyId: string, folder: "logo" | "dokumenti", fileName: string) {
  return `companies/${companyId}/${folder}/${crypto.randomUUID()}-${slugifyFileName(fileName)}`;
}

function fileWithCustomId(parts: BlobPart[], name: string, options: FilePropertyBag & { customId: string }) {
  const preparedFile = new File(parts, name, options) as File & { customId?: string };
  preparedFile.customId = options.customId;
  return preparedFile;
}

export async function prepareLogoFile(companyId: string, file: File) {
  if (!file.size) {
    throw new Error("Izberite logo datoteko.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Logo je lahko velik največ 5 MB.");
  }

  if (!logoTypes.has(file.type)) {
    throw new Error("Logo mora biti SVG, PNG, JPG ali WebP.");
  }

  if (file.type === "image/svg+xml") {
    const customId = companyUploadCustomId(companyId, "logo", file.name || "logo.svg");
    const preparedFile = fileWithCustomId([await file.arrayBuffer()], slugifyFileName(file.name || "logo.svg"), {
      customId,
      type: "image/svg+xml",
    });

    return { file: preparedFile, customId };
  }

  const webp = await sharp(Buffer.from(await file.arrayBuffer()))
    .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  const customId = companyUploadCustomId(companyId, "logo", "logo.webp");
  const preparedFile = fileWithCustomId([new Uint8Array(webp)], `${slugifyFileName(file.name).replace(/\.[^.]+$/, "") || "logo"}.webp`, {
    customId,
    type: "image/webp",
  });

  return { file: preparedFile, customId };
}

export async function uploadPreparedFile(file: File & { customId?: string }) {
  const result = await utapi.uploadFiles(file);

  if (result.error || !result.data) {
    throw new Error(result.error?.message || "Upload datoteke ni uspel.");
  }

  return result.data;
}

export function isUploadableCompanyDocument(file: File) {
  const allowedTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
  ]);

  return allowedTypes.has(file.type);
}

export function prepareDocumentFile(companyId: string, file: File) {
  const safeName = slugifyFileName(file.name || "dokument");
  const customId = companyUploadCustomId(companyId, "dokumenti", safeName);

  const preparedFile = fileWithCustomId([file], safeName, {
    customId,
    type: file.type || "application/octet-stream",
  });

  return { file: preparedFile, customId };
}
