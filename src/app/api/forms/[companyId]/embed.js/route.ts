export async function GET(request: Request, { params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const origin = new URL(request.url).origin;
  const source = `(function(){var s=document.currentScript;var f=document.createElement("iframe");f.src="${origin}/obrazec/${companyId}?embed=1";f.title="Kontaktni obrazec";f.style.cssText="width:100%;min-height:720px;border:0;display:block";f.loading="lazy";s.parentNode.insertBefore(f,s.nextSibling);})();`;
  return new Response(source, {
    headers: {
      "content-type": "application/javascript; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}
